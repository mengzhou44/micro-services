{{- define "service-c.name" -}}
service-c
{{- end -}}

{{- define "service-c.fullname" -}}
{{ .Release.Name }}-{{ include "service-c.name" . }}
{{- end -}}