export default function log(...logs) {
  console.log(`[${new Date().toLocaleTimeString()}]`, ...logs);
}
