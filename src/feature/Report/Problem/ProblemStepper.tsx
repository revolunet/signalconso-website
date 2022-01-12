import React, {ReactElement, ReactNode, useMemo} from 'react'

export interface ProblemStepperProps {
  renderDone?: ReactNode
  children: Array<ReactElement<ProblemStepProps>>
}

export interface ProblemStepProps {
  isDone?: boolean
  hidden?: boolean
  children: ReactNode
}

export const ProblemStepper = ({children, renderDone}: ProblemStepperProps) => {
  const isDone = useMemo(() => {
    return children.every(_ => _.props.hidden || _.props.isDone)
  }, [children])
  const res = []
  for (let i = 0; i < children.length; i++) {
    if (!children[i].props.hidden) {
      res.push(children[i])
      if (!children[i].props.isDone) break
    }
  }
  return (
    <>
      {res}
      {isDone && renderDone}
    </>
  )
}

export const ProblemStep = ({isDone, hidden, children}: ProblemStepProps) => {
  return (
    <>
      {children}
    </>
  )
}
