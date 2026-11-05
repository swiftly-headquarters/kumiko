import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export default function Demo() {
  return (
    <Questionnaire className="max-w-md" onSubmit={(e) => e.preventDefault()}>
      <QuestionnaireItem name="project">
        <QuestionnaireTitle>What are you building?</QuestionnaireTitle>
        <QuestionnaireInput placeholder="A short description" />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSkip />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
