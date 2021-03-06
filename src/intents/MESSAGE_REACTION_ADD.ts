import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Emoji } from "../structures/emoji.ts"
import { User } from "../structures/user.ts";
import { ChannelTypeData } from "../types/channel.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { emoji, member, message_id, channel_id, guild_id, user_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as TextChannel;
        let message = message_id
        if (client.cache.messages?.has(message_id)) message = client.cache.messages.get(message_id)
        return [new Emoji(emoji, client, guild), new GuildMember(member, guild, client), channel, message]
    } else {
        let channel;
        if (client.user?.isBot()) channel = new TextChannel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as TextChannel
        const user = await client.get(EntityType.USER, user_id as string) as User
        let message = message_id
        if (client.cache.messages?.has(message_id)) message = client.cache.messages.get(message_id)
        return [new Emoji(emoji, client), user, channel, message]
    }
}