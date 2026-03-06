export function format(template: string, ...values: (string | number)[]) {
  return template.replace(/\{(\d+)\}/g, (_, i) => String(values[Number(i)] ?? ''))
}