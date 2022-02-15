import {Card, CardContent} from '@mui/material'
import {DetailInput, DetailInputType, FileOrigin} from '@signal-conso/signalconso-api-sdk-js'
import {_Details, SpecifyFormUtils} from 'feature/Report/Details/Details'
import React, {useState} from 'react'

export class DetailsFixtureInput {

  static readonly textDetail: DetailInput = {
    label: 'texte label',
    rank: 1,
    type: DetailInputType.TEXT
  }

  static readonly dateDetail: DetailInput = {
    label: 'date label',
    rank: 2,
    type: DetailInputType.DATE_NOT_IN_FUTURE,
    defaultValue: 'SYSDATE'
  }

  static readonly radioDetail: DetailInput = {
    label: 'radio label',
    rank: 3,
    type: DetailInputType.RADIO,
    options: ['OPTION1', 'OPTION2 (à préciser)']
  }

  static readonly checkboxDetail: DetailInput = {
    label: 'checkbox label',
    rank: 5,
    type: DetailInputType.CHECKBOX,
    options: ['CHECKBOX1', 'CHECKBOX2 (à préciser)', 'CHECKBOX3']
  }

  static readonly textareaDetail: DetailInput = {
    label: 'description',
    rank: 4,
    type: DetailInputType.TEXTAREA
  }
}

export class DetailsFixtureValue {
  static readonly date = '10/11/2019'
  static readonly text = 'some text'
  static readonly radio = DetailsFixtureInput.radioDetail.options![1]
  static readonly checkbox = [DetailsFixtureInput.checkboxDetail.options![0], DetailsFixtureInput.checkboxDetail.options![1]]
  static readonly textarea = 'some other text'
}

export const PlaygroundDetails = () => {
  const inputs: DetailInput[] = [DetailsFixtureInput.dateDetail]
  const [state, setState] = useState<any>({})
  return (
    <Card elevation={2}>
      <CardContent>
        {JSON.stringify(state)}
        <_Details
          initialFiles={[
            {id: '1', filename: 'blabal', origin: FileOrigin.Consumer}
          ]}
          initialValues={{
            0: DetailsFixtureValue.date,
            1: DetailsFixtureValue.text,
            2: DetailsFixtureValue.radio,
            [SpecifyFormUtils.getInputName(2)]: 'blabla radio',
            3: DetailsFixtureValue.checkbox,
            [SpecifyFormUtils.getInputName(3)]: 'blabla cb',
            4: DetailsFixtureValue.textarea,
          }}
          inputs={[
            DetailsFixtureInput.dateDetail,
            DetailsFixtureInput.textDetail,
            DetailsFixtureInput.radioDetail,
            DetailsFixtureInput.checkboxDetail,
            DetailsFixtureInput.textareaDetail,
          ]}
          onSubmit={setState}/>
        ,
      </CardContent>
    </Card>
  )
}
