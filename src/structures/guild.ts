import { GuildMemberType, GuildType, GuildUpdateType, IconAttributesType, InviteType } from "../types/guild.ts";
import { ChannelCreateType, ChannelType } from "../types/channel.ts";
import { Client } from "./../client/client.ts";
import { Channel } from "./channel.ts";
import { GuildMember } from "./guildMember.ts";
import { EntityType, Snowflake } from "../types/utils.ts";
import { User } from "./user.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { fromUint8Array, lookup } from "../../deps.ts"
import { Emoji } from "./emoji.ts";
import { NewEmojiType } from "../types/emoji.ts";
import { Invite } from "./invite.ts";
import { Role } from "./role.ts";
import constants from "../constants.ts";

export class Guild {
  data: GuildType;
  client: Client;
  invites: Invite[] = [];
  members: GuildMember[] = [];
  channels: Channel[] = [];
  roles: Role[] = [];
  /**
   * Creates a guild instance.
   * @param {GuildType} data raw guild data from Discord API
   * @param {Client} client client instance
   */
  constructor(data: GuildType, client: Client) {
    this.data = data;
    this.client = client;
    this.roles = data.roles.map((r: RoleType) => new Role(r, client, this))
  }
  /**
   * Updates a guild.
   * @param {GuildUpdateType} data raw guild updating data to send
   * @returns {Promise<Guild>} updated guild
   */
  async update(data: GuildUpdateType): Promise<Guild> {
    const guild = await this.client._fetch<GuildType>("PATCH", `guilds/${this.data.id}`, JSON.stringify(data), true)
    return new Guild(guild, this.client);
  }
  /**
   * Deletes a guild.
   * @returns {Promise<boolean>} true if task was successful
   */
  async delete(): Promise<boolean> {
    const resp = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}`, null, false)
    if (resp.status != 204) throw new Error(`Error ${resp.status}`);
    return true;
  }
  /**
   * Fetches all channels in guild (or gets them from cache).
   * @returns {Promise<Channel[]>} fetched channels
   */
  async fetchChannels(): Promise<Channel[]> {
    if (this.channels.length > 0) return this.channels
    const json = await this.client._fetch<ChannelType[]>("GET", `guilds/${this.data.id}/channels`, null, true)
    this.channels = json.map((data: ChannelType) => new Channel(data, this.client, this))
    return this.channels
  }
  /**
   * Fetches all members from guild.
   * @param {boolean} refresh chooses whether to update the cache or not
   * @param {number} limit limit of members to fetch
   * @param {Snowflake} after after which member to fetch
   */
  async fetchMembers(limit = 1, after: Snowflake = "0"): Promise<GuildMember[]> {
    const json = await this.client._fetch<GuildMemberType[]>("GET", `guilds/${this.data.id}/members?limit=${limit}&after=${after}`, null, true)
    return this.members = json.map((data: GuildMemberType) => new GuildMember(data, this, this.client))
  }
  /**
   * Fetches guild entites from Discord API
   * @param {EntityType} type entity to fetch
   * @param id 
   */
  async get(type: EntityType, id: Snowflake, refresh = false): Promise<GuildMember | Channel | Role | undefined> {
    switch (type) {
      // deno-lint-ignore no-case-declarations
      case EntityType.GUILD_MEMBER:
        let found
        if (this.members.length > 0) {
          found = this.members.find((x: GuildMember) => x.data.user?.id == id)
          if (found && !refresh) return found
        }
        const json = await this.client._fetch<GuildMemberType>("GET", `guilds/${this.data.id}/members/${id}`, null, true)
        const member = new GuildMember(json, this, this.client)
        if (found) {
          this.members = this.members.map((x: GuildMember) => x.data.user?.id == id ? member : x)
        } else {
          this.members.push(member)
        }
        return member
      case EntityType.CHANNEL:
        return (await this.fetchChannels()).find(ch => ch.data.id == id);
      case EntityType.ROLE:
        return this.roles.find(r => r.data.id == id)
      default:
        throw Error("Wrong EntityType")
    }
  }
  /**
   * Checks if the item is a user.
   * @param {any} item item to check
   * @returns {boolean} true if item is a user
   */
  isUser(item: any): item is User {
    return (item as User).isMe() !== undefined
  }
  /**
   * Creates a channel.
   * @param {ChannelCreateType} data raw channel data to send
   * @returns {Promise<Channel>} created channel
   */
  async createChannel(data: ChannelCreateType): Promise<Channel> {
    const json = await this.client._fetch<ChannelType>("POST", `guilds/${this.data.id}/channels`, JSON.stringify(data), true)
    return new Channel(json, this.client, this);
  }
  /**
   * Generates a guild icon URL.
   * @param {IconAttributesType} attr icon attributes
   */
  async icon(attr: IconAttributesType = {}): Promise<string> {
    if (attr.size && constants.IMAGE_SIZES.includes(attr.size))
      throw new Error(`Size must be one of ${constants.IMAGE_SIZES.join(", ")}`);
    if (attr.format && constants.IMAGE_FORMATS.includes(attr.format))
      throw new Error(`Format must be one of ${constants.IMAGE_FORMATS.join(", ")}`);

    return `https://cdn.discordapp.com/icons/${this.data.id}/${this.data.icon}.${'png' ?? attr.format}?size=${4096 ?? attr.size}`
  }
  /**
   * Leaves from guild.
   * @returns {Promise<boolean>} true if task was successful
   */
  async leave(): Promise<boolean> {
    const response = await this.client._fetch<Response>("DELETE", `users/@me/guilds/${this.data.id}`, null, false)
    return response.status == 204
  }
  /**
   * Bans a member.
   * @param {string} id member (user) ID to ban
   * @param {string} [reason] ban reason 
   */
  async ban(id: string, reason?: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("PUT", `guilds/${this.data.id}/bans/${id}`, JSON.stringify({ reason }), false)
    return response.status == 204
  }
  /**
   * Revokes a ban from user.
   * @param {string} id member ID
   * @returns {Promise<boolean>} true if operation was successful
   */
  async unban(id: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/bans/${id}`, null, false)
    return response.status == 204
  }
  /**
   * Kicks a member from guild.
   * @param {string} id member (user) ID to kick
   */
  async kick(id: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/members/${id}`, null, false)
    return response.status == 204
  }
  /**
   * Changes a bot or other member nickname.
   * @param {string} nick nickname
   * @param {string} [id] member (user) ID to change, defaults to bot 
   */
  async nickname(nick: string, id?: string): Promise<boolean> {
    const response = await this.client._fetch<Response>("PATCH", `guilds/${this.data.id}/members/${id ?? "@me"}${id ? "" : "/nick"}`, JSON.stringify({ nick }), false)
    return response.status == 200
  }
  /**
   * Creates a role.
   * @param {RoleEditType} role raw role data to send
   */
  async createRole(role: RoleEditType): Promise<RoleType> {
    return await this.client._fetch<RoleType>("POST", `guilds/${this.data.id}/roles`, JSON.stringify(role), true)
  }
  /**
   * Edits a role.
   * @param {string} id role ID to edit
   * @param {RoleEditType} role raw role data to send
   * @returns {Promise<RoleType>} raw edited role
   */
  async editRole(id: string, role: RoleEditType): Promise<Role> {
    const edited = await this.client._fetch<RoleType>("PATCH", `guilds/${this.data.id}/roles/${id}`, JSON.stringify(role), true)
    const foundRaw = this.data.roles.findIndex((x: RoleType) => x.id == id)
    if (foundRaw >= 0) this.data.roles[foundRaw] = edited
    const foundRole = this.roles.findIndex((x: Role) => x.data.id == id)
    if (foundRole >= 0) {
      this.roles[foundRole].data = edited
      return this.roles[foundRole]
    }
    const editedRole = new Role(edited, this.client, this)
    this.roles.push(editedRole)
    return editedRole
  }
  /**
   * Edits a role.
   * @param {string} id role ID to edit
   * @returns {Promise<boolean>} true if task was successful
   */
  async deleteRole(id: string): Promise<boolean> {
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/roles/${id}`, null, false)
    const foundRaw = this.data.roles.findIndex((x: RoleType) => x.id == id)
    if (foundRaw >= 0) this.data.roles.splice(foundRaw, 1)
    const foundRole = this.roles.findIndex((x: Role) => x.data.id == id)
    if (foundRole >= 0) this.roles.splice(foundRole, 1)
    return response.status == 204
  }
  /**
   * Fetches all guild invites.
   * @returns {Promise<Invite[]>} fetched invites
   */
  async fetchInvites(): Promise<Invite[]> {
    const invites = await this.client._fetch<InviteType[]>("GET", `guilds/${this.data.id}/invites`, null, true)
    this.invites = invites.map((x: InviteType) => new Invite(x, this.client, this))
    this.invites.forEach((x: Invite) => this.client.cache.set(x.data.code, x))
    return this.invites
  }
  /**
   * Adds a new role to member.
   * @param {string} member_id member ID to which role will be added
   * @param {string} role_id role ID to add
   * @returns {Promise<boolean>} true if task was successful
   */
  async addRole(member_id: string, role_id: string): Promise<boolean> {
    const response = await this.client._fetch<Response>("PUT", `guilds/${this.data.id}/members/${member_id}/roles/${role_id}`, null, false)
    return response.status == 204
  }
  /**
   * Creates a new emoji.
   * @param {NewEmojiType} data raw emoji data to send
   * @returns {Promise<Emoji>} created emoji
   */
  async createEmoji(data: NewEmojiType): Promise<Emoji> {
    const response = await this.client._fetch<Response>("POST", `guilds/${this.data.id}/emojis`, JSON.stringify({
      name: data.name, roles: data.roles, image: `data:${lookup(data.file_format)};base64,${fromUint8Array(data.image)}`
    }), false)
    return new Emoji(await response.json(), this.client, this)
  }

  toString() {
    return `Guild {"data":${JSON.stringify(this.data)}}`
  }
}