# Pasta de Vídeos das Campanhas

Esta pasta contém os vídeos publicitários das campanhas da Amanda Lima.

## Estrutura recomendada:

```
src/videos/
├── beleza-natural/
│   ├── campanha-principal.mp4
│   ├── making-of.mp4
│   └── depoimento.mp4
├── super-premium/
│   ├── vida-saudavel.mp4
│   └── produtos-organicos.mp4
├── moda-style/
│   ├── verao-2025.mp4
│   └── get-ready-with-me.mp4
└── gourmet-foods/
    ├── gourmet-todo-dia.mp4
    └── pratos-especiais.mp4
```

## Formatos suportados:
- MP4 (recomendado)
- WebM
- OGV

## Tamanhos recomendados:
- Máximo: 50MB por vídeo
- Resolução: 1920x1080 (Full HD)
- Taxa de bits: 2-5 Mbps

## Como adicionar novos vídeos:
1. Coloque o arquivo na pasta correspondente à campanha
2. Atualize o arquivo `blog-script.js` com o caminho do vídeo
3. Teste o carregamento no modal da campanha