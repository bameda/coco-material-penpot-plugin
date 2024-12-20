/**
 * This file contains the typescript interfaces for the plugin events.
 */

export interface RawMessagePluginEvent {
  type: string
  contents?: string
}

export interface ThemePluginEvent extends RawMessage {
  type: 'theme'
  content: string
}

export interface SvgPluginEvent extends RawMessage {
  type: 'svg'
  content: string
  name: string
}

export interface GifPluginEvent extends RawMessage {
  type: 'gif'
  content: string
  name: string
}

export type RawMessage = RawMessagePluginEvent
export type ThemeMessage = ThemePluginEvent
export type SvgMessage = SvgPluginEvent
export type GifMessage = GifPluginEvent
