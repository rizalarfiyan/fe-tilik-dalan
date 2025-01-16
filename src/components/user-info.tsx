import type React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { avatarAlias } from '@lib/utils'

interface UserInfoProps {
	name: string
	email: string
	avatar: string
}

const UserInfo: React.FC<UserInfoProps> = ({ name, email, avatar }) => {
	return (
		<>
			<Avatar className="size-10 rounded-lg">
				<AvatarImage src={avatar} alt={name} />
				<AvatarFallback className="rounded-lg">
					{avatarAlias(name)}
				</AvatarFallback>
			</Avatar>
			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-semibold">{name}</span>
				<span className="truncate text-xs">{email}</span>
			</div>
		</>
	)
}

export default UserInfo
