type FieldProps = {
  required: boolean
}

export type FieldType = "text" | "email" | "textarea" | "checkbox" | "radio" | "select"

export type Field = {
  type: FieldType
  name: string
  label: string
  props: {
    required: boolean
    pattern?: string
    placeholder?: string
    confirmField?: string
    choices?: {
      value: string,
      label: string,
      children: Field[]
    }[]
  }
}
