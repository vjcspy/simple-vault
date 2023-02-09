export default function Home() {
  // @ts-ignore
  const { versions } = window;
  const information = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
  return <>{information}</>;
}
