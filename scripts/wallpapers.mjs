/**
 * Wallpaper presets for the frosted-glass ground.
 *
 * Three kinds, one shelf each in the picker:
 *
 * - Photos ship as JPEG data URLs. The plugin's own files are not served by the
 *   host, so an image has to travel inside the bundle as base64. Every photo
 *   therefore costs its file size plus a third, and the set is kept small.
 * - Gradients are plain CSS `background-image` values: no bytes on disk, and no
 *   file served at runtime. Under frosted glass the ground is a blurred field of
 *   colour, so a well-built gradient is indistinguishable from a photograph of
 *   one — which is why the cheap presets are the majority here.
 * - Plain colours are one flat fill each, for the grounds that must stay quiet.
 *
 * Labels are proper nouns (place and colour names) and read the same in both
 * dictionaries, so they stay literal rather than going through `t()`.
 */

/**
 * Photographs. The first seven come from the system desktop pictures; the rest
 * are original renders made for this plugin.
 */
export const WALLPAPER_PHOTOS = [
  { id: 'sonoma', label: 'Sonoma', file: 'sonoma.jpg' },
  { id: 'mac-blue', label: 'Mac Blue', file: 'mac-blue.jpg' },
  { id: 'mac-purple', label: 'Mac Purple', file: 'mac-purple.jpg' },
  { id: 'radial-sky-blue', label: 'Radial Sky', file: 'radial-sky-blue.jpg' },
  { id: 'big-sur-coastline', label: 'Big Sur', file: 'big-sur-coastline.jpg' },
  { id: 'catalina-sunset', label: 'Catalina', file: 'catalina-sunset.jpg' },
  { id: 'big-sur-night-grasses', label: 'Night Grasses', file: 'big-sur-night-grasses.jpg' },
  { id: 'canopy', label: 'Canopy', file: 'canopy.jpg' },
  { id: 'dunes', label: 'Dunes', file: 'dunes.jpg' },
  { id: 'ember', label: 'Ember', file: 'ember.jpg' },
  { id: 'glacier', label: 'Glacier', file: 'glacier.jpg' },
  { id: 'monsoon', label: 'Monsoon', file: 'monsoon.jpg' },
  { id: 'tidal', label: 'Tidal', file: 'tidal.jpg' },
]

/**
 * Gradients. Each has a soft radial body so the blurred result keeps the
 * gentle falloff of a real wallpaper instead of reading as a flat wash.
 * The colour is the preset's whole point, so these literals are content, not
 * theme surface — the same way the photos' pixels are.
 */
export const WALLPAPER_GRADIENTS = [
  {
    id: 'dusk-blue',
    label: 'Dusk Blue',
    css: 'radial-gradient(130% 120% at 18% 6%, #4a7bf0 0%, #2a3f8f 42%, #101a3c 74%, #070c1c 100%)',
  },
  {
    id: 'violet-haze',
    label: 'Violet Haze',
    css: 'radial-gradient(130% 120% at 22% 4%, #a878ff 0%, #6c3ec4 44%, #341a63 76%, #150a26 100%)',
  },
  {
    id: 'rose-quartz',
    label: 'Rose Quartz',
    css: 'radial-gradient(130% 120% at 26% 8%, #ff9ac4 0%, #d4568c 42%, #7a2350 76%, #2a0c1c 100%)',
  },
  {
    id: 'mint',
    label: 'Mint',
    css: 'linear-gradient(158deg, #d6f6e2 0%, #8fe0b4 30%, #46b98d 62%, #176b52 100%)',
  },
  {
    id: 'amber',
    label: 'Amber',
    css: 'linear-gradient(158deg, #ffe3b0 0%, #ffb865 32%, #ef8340 64%, #8f3a1c 100%)',
  },
  {
    id: 'lilac',
    label: 'Lilac',
    css: 'linear-gradient(158deg, #ece2ff 0%, #c3aef4 32%, #8f75d9 64%, #46306f 100%)',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    css: 'radial-gradient(90% 130% at 12% 4%, #4ce0b3 0%, #2f9fd6 38%, #2a5bb0 68%, #0a1a36 100%)',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    css: 'linear-gradient(198deg, #ffd48a 0%, #ff9a6b 26%, #e0629b 56%, #6b3f8f 82%, #241a45 100%)',
  },
]

/**
 * Plain grounds: the quiet end of the range, where the blur has nothing to
 * chew on and the ground should read as a flat sheet of paper.
 */
export const WALLPAPER_PLAINS = [
  { id: 'white', label: 'White', css: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)' },
  { id: 'off-white', label: 'Off White', css: 'linear-gradient(180deg, #f5f2ea 0%, #f5f2ea 100%)' },
  { id: 'light-gray', label: 'Light Gray', css: 'linear-gradient(180deg, #d9d9dc 0%, #d9d9dc 100%)' },
  {
    id: 'graphite',
    label: 'Graphite',
    css: 'linear-gradient(164deg, #f0f0f2 0%, #b6b6bd 34%, #75757e 66%, #34343c 100%)',
  },
]

/** The shelves the picker shows, in order. */
export const WALLPAPER_GROUPS = ['plain', 'gradient', 'photo']

/** Everything the picker shows as a preset, in display order. */
export const WALLPAPER_PRESETS = [
  ...WALLPAPER_PLAINS.map(preset => ({ ...preset, group: 'plain' })),
  ...WALLPAPER_GRADIENTS.map(preset => ({ ...preset, group: 'gradient' })),
  ...WALLPAPER_PHOTOS.map(preset => ({ ...preset, group: 'photo' })),
]
