{{- define "service-a.name" -}}
service-a
{{- end -}}

{{- define "service-a.fullname" -}}
{{ .Release.Name }}
{{- end -}}