{{- define "service-b.name" -}}
service-b
{{- end -}}

{{- define "service-b.fullname" -}}
{{ .Release.Name }}
{{- end -}}