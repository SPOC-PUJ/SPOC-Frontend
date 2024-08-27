# Usa una imagen base de Envoy
FROM envoyproxy/envoy:v1.23.2

# Copia el archivo de configuración al contenedor
COPY envoy.yaml /etc/envoy/envoy.yaml

# Establece el comando de inicio
CMD ["envoy", "-c", "/etc/envoy/envoy.yaml"]
