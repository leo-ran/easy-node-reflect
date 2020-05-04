import Module = NodeJS.Module;

export function iDebuglog<T>(value: T, module: Module, title?: string) {
  console.log(`--------------------DEBUG-----------------------`);
  if (title) {
    console.log(`========${title}`)
  }
  console.log(value);
  console.log(`at ${module.id}`);
  console.log(`--------------------DEBUG-----------------------`);
}