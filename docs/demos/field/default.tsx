import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Demo() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" />
        <FieldDescription>We will never share it.</FieldDescription>
        <FieldError errors={[{ message: "Email is required" }]} />
      </Field>
    </FieldGroup>
  )
}
