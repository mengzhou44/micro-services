{{- define "service-b.name" -}}
service-b
{{- end -}}

{{- define "service-b.fullname" -}}
{{ .Release.Name }}-{{ include "service-b.name" . }}
{{- end -}}
