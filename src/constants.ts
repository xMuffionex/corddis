import { Channel } from "./structures/channel.ts"
import { NewsChannel } from "./structures/newsChannel.ts"
import { ChannelTypeData } from "./types/channel.ts"
import { TextChannel } from "./structures/textChannel.ts"
import { DictionaryType, NumberDictionaryType } from "./types/utils.ts"

export const Constants = {
    BASE_URL: "https://discord.com/api",
    VERSION: 8,
    USER_AGENT: "Corddis (https://github.com/marek12306/corddis, v0)",
    IMAGE_SIZES: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
    IMAGE_FORMATS: ['webp', 'png', 'jpg', 'jpeg', 'gif'],
    ZLIB_SUFFIX: '\x00\x00\xff\xff'
}

export const Intents = {
    GUILDS: 1<< 0,
    GUILD_MEMBERS: 1 << 1,
    GUILD_BANS: 1 << 2,
    GUILD_EMOJIS: 1 << 3,
    GUILD_INTEGRATIONS: 1 << 4,
    GUILD_WEBHOOKS: 1 << 5,
    GUILD_INVITES: 1 << 6,
    GUILD_VOICE_STATES: 1 << 7,
    GUILD_PRESENCES: 1 << 8,
    GUILD_MESSAGES: 1 << 9,
    GUILD_MESSAGE_REACTIONS: 1 << 10,
    GUILD_MESSAGE_TYPING: 1 << 11,
    DIRECT_MESSAGES: 1 << 12,
    DIRECT_MESSAGE_REACTIONS: 1 << 13,
    DIRECT_MESSAGE_TYPING: 1 << 14
}

export const Permissions: DictionaryType = {
    CREATE_INSTANT_INVITE: 0x00000001,
    KICK_MEMBERS: 0x00000002,
    BAN_MEMBERS: 0x00000004,
    ADMINISTRATOR: 0x00000008,
    MANAGE_CHANNELS: 0x00000010,
    MANAGE_GUILD: 0x00000020,
    ADD_REACTIONS: 0x00000040,
    VIEW_AUDIT_LOG: 0x00000080,
    PRIORITY_SPEAKER: 0x00000100,
    STREAM: 0x00000200,
    VIEW_CHANNEL: 0x00000400,
    SEND_MESSAGES: 0x00000800,
    SEND_TTS_MESSAGES: 0x00001000,
    MANAGE_MESSAGES: 0x00002000,
    EMBED_LINKS: 0x00004000,
    ATTACH_FILES: 0x00008000,
    READ_MESSAGE_HISTORY: 0x00010000,
    MENTION_EVERYONE: 0x00020000,
    USE_EXTERNAL_EMOJIS: 0x00040000,
    VIEW_GUILD_INSIGHTS: 0x00080000,
    CONNECT: 0x00100000,
    SPEAK: 0x00200000,
    MUTE_MEMBERS: 0x00400000,
    DEAFEN_MEMBERS: 0x00800000,
    MOVE_MEMBERS: 0x01000000,
    USE_VAD: 0x02000000,
    CHANGE_NICKNAME: 0x04000000,
    MANAGE_NICKNAMES: 0x08000000,
    MANAGE_ROLES: 0x10000000,
    MANAGE_WEBHOOKS: 0x20000000,
    MANAGE_EMOJIS: 0x40000000,
}

export enum PermissionEnum {
    CREATE_INSTANT_INVITE,
    KICK_MEMBERS,
    BAN_MEMBERS,
    ADMINISTRATOR,
    MANAGE_CHANNELS,
    MANAGE_GUILD,
    ADD_REACTIONS,
    VIEW_AUDIT_LOG,
    PRIORITY_SPEAKER,
    STREA,
    VIEW_CHANNEL,
    SEND_MESSAGES,
    SEND_TTS_MESSAGES,
    MANAGE_MESSAGES,
    EMBED_LINKS,
    ATTACH_FILES,
    READ_MESSAGE_HISTORY,
    MENTION_EVERYONE,
    USE_EXTERNAL_EMOJIS,
    VIEW_GUILD_INSIGHTS,
    CONNECT,
    SPEAK,
    MUTE_MEMBERS,
    DEAFEN_MEMBERS,
    MOVE_MEMBERS,
    USE_VAD,
    CHANGE_NICKNAME,
    MANAGE_NICKNAMES,
    MANAGE_ROLES,
    MANAGE_WEBHOOKS,
    MANAGE_EMOJIS,
}

export const ChannelStructures: NumberDictionaryType = {
    [ChannelTypeData.GUILD_TEXT]: TextChannel,
    [ChannelTypeData.DM]: TextChannel,
    [ChannelTypeData.GUILD_VOICE]: Channel,
    [ChannelTypeData.GROUP_DM]: TextChannel,
    [ChannelTypeData.GUILD_CATEGORY]: Channel,
    [ChannelTypeData.GUILD_NEWS]: NewsChannel,
    [ChannelTypeData.GUILD_STORE]: Channel
}
