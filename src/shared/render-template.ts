type TemplateVariables = Record<string, string | number | boolean | Date>;

const TEMPLATE_VARIABLE_PATTERN = /{{\s*([\w.-]+)\s*}}/g;

export function renderTemplate(content: string, variables: TemplateVariables): string {
  return content.replace(TEMPLATE_VARIABLE_PATTERN, (_, variableName: string) => {
    const value = variables[variableName];
    return String(value);
  });
}
