import {useColors} from '@codegouvfr/react-dsfr/useColors'
import {Skeleton} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {CountByDate} from 'clients/SignalConsoApiClient'
import {useI18n} from 'i18n/I18n'
import React from 'react'
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import {Txt} from '../../components_simple/Txt'
import {ifDefined} from '../../utils/utils'

interface Props {
  name?: string
  title: string
  description?: string
  percentage?: boolean
  count: () => Promise<number>
  curve?: () => Promise<CountByDate[]>
}

export const Stat = React.memo(({name, count, curve, title, description, percentage}: Props) => {
  const {m, formatLargeNumber} = useI18n()

  const _count = useQuery(['stats_count', name], count)
  const _curve = useQuery(['stats_curve', name], curve ?? (() => Promise.resolve(undefined)), {enabled: !!curve})
  const formatCurveDate = ({date, count}: CountByDate): {date: string; count: number} => ({
    date: (m.monthShort_ as any)[date.getMonth() + 1],
    count,
  })

  return (
    <div className="border border-solid border-black p-4">
      {_count.data ? (
        <Txt
          block
          component="h2"
          sx={{
            lineHeight: 1,
            fontSize: 34,
            mb: 0,
            fontWeight: 'normal',
          }}
        >
          {ifDefined(_count.data, formatLargeNumber)} {percentage && '%'}
        </Txt>
      ) : (
        <Skeleton className="inline-block" width={100} />
      )}

      <p>{title}</p>
      {description && <p>{description}</p>}

      {curve && (
        <div className="h-40 md:h-64 lg:h-80 mt-4 flex items-center justify-center">
          {_curve.isLoading ? (
            <div className="h-full w-full bg-gray-200 rounded-xl" />
          ) : (
            _curve.data && <ActualChart data={_curve.data.map(formatCurveDate)} name={name} />
          )}
        </div>
      )}
    </div>
  )
})

function ActualChart({data, name}: {data: {date: string; count: number}[]; name?: string}) {
  const dsfrTheme = useColors()
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        role="img"
        accessibilityLayer
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar legendType={'none'} name={name} dataKey="count" fill={dsfrTheme.decisions.artwork.minor.blueEcume.default} />
      </BarChart>
    </ResponsiveContainer>
  )
}
