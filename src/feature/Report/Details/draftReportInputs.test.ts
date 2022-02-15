import '@testing-library/jest-dom'
import {DraftReportDefaultInputs, getDraftReportInputs} from './draftReportInputs'
import {genSubcategory} from '../../../test/fixture'
import {ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import { DetailsFixtureInput } from 'pages/playground'

describe('getDraftReportInputs', () => {

  it('should generate default inputs', () => {
    const inputs = getDraftReportInputs({
      subcategories: [genSubcategory()],
    })
    expect(inputs).toEqual(DraftReportDefaultInputs.defaults)
  })

  it('should generate default inputs including reponseConso inputs', () => {
    const inputs = getDraftReportInputs({
      subcategories: [genSubcategory()],
      tags: [ReportTag.ReponseConso]
    })
    expect(inputs).toEqual([
      ...DraftReportDefaultInputs.defaults,
      DraftReportDefaultInputs.reponseConso
    ])
  })

  it('should generate single input with optional textarea', () => {
    const inputs = getDraftReportInputs({
      subcategories: [
        genSubcategory(),
        {id: '', title: '', detailInputs: [DetailsFixtureInput.textDetail,]},
      ],
    })
    expect(inputs).toEqual([
      DetailsFixtureInput.textDetail,
      DraftReportDefaultInputs.description(true)
    ])
  })

  it('should generate custom input with reponseconso', () => {
    const inputs = getDraftReportInputs({
      tags: [ReportTag.ReponseConso],
      subcategories: [
        genSubcategory(),
        {id: '', title: '', detailInputs: [DetailsFixtureInput.dateDetail,]},
      ],
    })
    expect(inputs).toEqual([
      DetailsFixtureInput.dateDetail,
      DraftReportDefaultInputs.description(true),
      DraftReportDefaultInputs.reponseConso
    ])
  })
})
