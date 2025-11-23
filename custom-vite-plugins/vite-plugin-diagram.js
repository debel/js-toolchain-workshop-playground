/*
 * Generated with the help of claude sonnet 4.5
 */

export default function diagramSvgPlugin() {
  return {
    name: 'vite-plugin-diagram-svg',
    transform(code, id) {
      if (!id.endsWith('.diagram')) return null;

      const svg = parseDiagramToSvg(code);

      return {
        code: `export default ${JSON.stringify(svg)}`,
        map: null,
      };
    },
  };
}

function parseDiagramToSvg(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const edges = [];
  const nodes = new Set();

  for (const line of lines) {
    const undirected = line.match(/^(\w+)\s*--\s*(\w+)$/);
    const directed = line.match(/^(\w+)\s*->\s*(\w+)$/);
    const reversed = line.match(/^(\w+)\s*<-\s*(\w+)$/);

    if (undirected) {
      const [, from, to] = undirected;
      nodes.add(from);
      nodes.add(to);
      edges.push({ from, to, type: 'undirected' });
    } else if (directed) {
      const [, from, to] = directed;
      nodes.add(from);
      nodes.add(to);
      edges.push({ from, to, type: 'directed' });
    } else if (reversed) {
      const [, to, from] = reversed;
      nodes.add(from);
      nodes.add(to);
      edges.push({ from, to, type: 'directed' });
    }
  }

  const nodeArray = Array.from(nodes);
  const nodePositions = calculateLayout(nodeArray);

  return generateSvg(nodePositions, edges);
}

function calculateLayout(nodes) {
  const positions = {};
  const centerX = 250;
  const centerY = 200;
  const radius = 120;
  const count = nodes.length;

  if (count === 1) {
    positions[nodes[0]] = { x: centerX, y: centerY };
    return positions;
  }

  nodes.forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    positions[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return positions;
}

function generateSvg(nodePositions, edges) {
  const nodes = Object.keys(nodePositions);
  const nodeRadius = 30;
  const padding = 40;

  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const pos of Object.values(nodePositions)) {
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x);
    maxY = Math.max(maxY, pos.y);
  }

  const width = maxX - minX + padding * 2 + nodeRadius * 2;
  const height = maxY - minY + padding * 2 + nodeRadius * 2;
  const offsetX = -minX + padding + nodeRadius;
  const offsetY = -minY + padding + nodeRadius;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += '<defs>';
  svg += '<marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">';
  svg += '<polygon points="0 0, 10 3, 0 6" fill="#666" />';
  svg += '</marker>';
  svg += '</defs>';

  // Draw edges
  for (const edge of edges) {
    const from = nodePositions[edge.from];
    const to = nodePositions[edge.to];

    const fromX = from.x + offsetX;
    const fromY = from.y + offsetY;
    const toX = to.x + offsetX;
    const toY = to.y + offsetY;

    // Calculate edge endpoints at node boundaries
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const startX = fromX + nodeRadius * Math.cos(angle);
    const startY = fromY + nodeRadius * Math.sin(angle);
    const endX = toX - nodeRadius * Math.cos(angle);
    const endY = toY - nodeRadius * Math.sin(angle);

    if (edge.type === 'directed') {
      svg += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" `;
      svg += 'stroke="#666" stroke-width="2" marker-end="url(#arrowhead)" />';
    } else {
      svg += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" `;
      svg += 'stroke="#666" stroke-width="2" />';
    }
  }

  // Draw nodes
  for (const node of nodes) {
    const pos = nodePositions[node];
    const x = pos.x + offsetX;
    const y = pos.y + offsetY;

    svg += `<circle cx="${x}" cy="${y}" r="${nodeRadius}" fill="#4a9eff" stroke="#2563eb" stroke-width="2" />`;
    svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" `;
    svg += 'fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">';
    svg += node;
    svg += '</text>';
  }

  svg += '</svg>';

  return svg;
}
