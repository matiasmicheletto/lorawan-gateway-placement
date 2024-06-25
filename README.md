# lorawan-gateway-placement
Gateway placement problem for smartcities with topology constraints


## Imported data format

Data is imported and exported in plain text, using json format. Structure is as follows:

```json
{
  "gateways": [
    {
        "location": [], // lat, lng
        "sf_ranges": [
            [], // Polygon for SF 7
            [], // SF8
            [], // SF9
            [], // SF10
            [], // SF11
            []  // SF12
        ]
    }  
  ],
  "end_devices": [
    {
        "location": [], // lat, lng
        "ufs": [] // Utilization factor for each SF
    }
  ],
  "connections": [
    [] // Gateway index from, end device index to, sf used
  ]
}
```