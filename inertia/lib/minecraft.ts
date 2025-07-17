export function getSkinUrl(username: string) {
  return `https://mineskin.eu/skin/${username}`
}

export function getHeadUrl(username: string) {
  return `https://api.paladium.games/v1/global/launcher/session/minecraft/skin/${username}/avatar/100`
}
