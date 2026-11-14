export function download(filename: string, contents: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([contents], { type: type + ';charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
