// note: Radio then multi-select.

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export default function Demo() {
  return (
    <Questionnaire className="max-w-md" onSubmit={(e) => e.preventDefault()}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="stack" required>
        <QuestionnaireTitle>Which framework do you use?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Pick the one you use most.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="next">
            Next.js
            <QuestionnaireChoiceDescription>
              React with server rendering
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="vite">Vite</QuestionnaireChoice>
          <QuestionnaireChoice value="remix">Remix</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="tools" multiple>
        <QuestionnaireTitle>Which tools do you want?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="lint">Linting</QuestionnaireChoice>
          <QuestionnaireChoice value="test">Testing</QuestionnaireChoice>
          <QuestionnaireChoice value="ci">CI</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
