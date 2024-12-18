import type { ThemeMessage, RawMessage } from './model';

penpot.ui.open('CocoMaterial', `?theme=${penpot.theme}`);

penpot.on('themechange', (theme) => setTheme({ type: 'theme', content: theme }));

function setTheme(message: ThemePluginEvent) {
  penpot.ui.sendMessage(message);
}

penpot.ui.onMessage(async(rawMessage: RawMessage) => {
  switch (rawMessage.type) {
    case "svg": addSvg(rawMessage); break;
    case "gif": await addGif(rawMessage); break;
  }
});

function addSvg(message: SvgMessage) {
  const shape = penpot.createShapeFromSvg(message.content);

  if (shape) {
    shape.name = message.name;
    shape.proportionLock = true;
    shape.constraintsHorizontal = "scale";
    shape.constraintsVertical = "scale";
    shape.x = penpot.viewport.center.x;
    shape.y = penpot.viewport.center.y;
    penpot.selection = [shape];
  }
}

async function addGif(message: GifMessage) {
  // TODO: Test me with a gif
  const imageData = await penpot.uploadMediaUrl(
    message.name,
    message.content
  );

  if (imageData) {
    const shape = penpot.createRectangle();
    shape.fills = [{ fillOpacity: 1, fillImage: imageData }];
    shape.name = message.name;
    shape.proportionLock = true;
    shape.constraintsHorizontal = "scale";
    shape.constraintsVertical = "scale";
    shape.x = penpot.viewport.center.x;
    shape.y = penpot.viewport.center.y;
    penpot.selection = [shape];
  }
}
