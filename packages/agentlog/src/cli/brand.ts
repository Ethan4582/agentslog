export const ASCII_LOGO = [
  " █████╗  ██████╗ ███████╗███╗   ██╗████████╗██╗      ██████╗  ██████╗",
  "██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██║     ██╔═══██╗██╔════╝",
  "███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ██║     ██║   ██║██║  ███╗",
  "██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ██║     ██║   ██║██║   ██║",
  "██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████╗╚██████╔╝╚██████╔╝",
  "╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝  ╚═════╝"
];

const AMBER = "\x1b[38;2;245;166;35m";
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

export async function renderBrandHeader(animate = false): Promise<void> {
  if (!animate || !process.stdout.isTTY) {
    console.log();
    for (const line of ASCII_LOGO) {
      console.log(`${AMBER}${line}${RESET}`);
    }
    console.log(`  ${DIM}agentlog v0.1.0 — zero-config AI session logger${RESET}\n`);
    return;
  }

  console.log();
  for (const line of ASCII_LOGO) {
    process.stdout.write(`${AMBER}${line}${RESET}\n`);
    await new Promise((r) => setTimeout(r, 45));
  }
  console.log(`  ${DIM}agentlog v0.1.0 — zero-config AI session logger${RESET}\n`);
}
