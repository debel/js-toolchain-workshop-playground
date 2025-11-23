export default function renderJSON(input) {
  const ctx = {
    depth: 0,
  };

  return renderElement(ctx, input);
}

function renderElement(ctx, el) {
  if (!el) {
    return ''
  }

  if (Array.isArray(el)) {
    return renderArray(ctx, el);
  }

  switch (typeof el) {
    case "object":
      return renderObject(ctx, el);
    default:
      return renderString(ctx, el);
  }
}

function renderArray(ctx, arr) {
  let wrapperTag = 'section';
  let itemTag = 'article';

  if (isList(ctx, arr)) {
    wrapperTag = 'ul';
    itemTag = 'li';
  }

  const items = [];
  for (let v of arr) {
    items.push(`<${itemTag}>${renderElement(withContext(ctx), v)}</${itemTag}>`)
  }

  return `<${wrapperTag}>${items.join('')}</${wrapperTag}>`
}

function renderObject(ctx, obj) {
  if (isArticle(ctx, obj)) {
    console.error('rendering article', obj, ctx);
    return renderArticle(ctx, obj);
  }

  console.error('rendering table', obj, ctx);
  const items = [];
  for (let [k, v] of Object.entries(obj)) {
    items.push(`<tr><td>${k}</td><td>${renderElement(withContext(ctx), v)}</td></tr>`)
  }

  return `<table>${items.join('')}</table>`
}

function renderString(ctx, el) {
  return el.toString()
}

function isArticle(ctx, obj) {
  if (ctx.depth > 3) {
    return false;
  }

  return !!obj.title
}

function isList(ctx, arr) {
  return !arr.some(el => typeof el === 'object')
}

function renderArticle(ctx, obj) {
  const titleLevel = Math.min(ctx.depth + 1, 6);

  const clone = Object.assign({}, obj);
  delete clone.title

  return `<h${titleLevel}>${obj.title}</h${titleLevel}>${renderElement(withContext(ctx), clone)}`
}

function withContext(ctx, props) {
  let depth = ctx.depth || 0;
  depth += 1;

  return Object.assign({}, ctx, { depth }, props)
}
