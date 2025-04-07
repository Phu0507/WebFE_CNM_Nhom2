import { Avatar, AvatarGroup } from "@chakra-ui/react";

const ChatAvatars = ({ loggedInUser, chat }) => {
  const renderAvatars = () => {
    if (chat.isGroupChat) {
      // Lọc ra các thành viên không phải bản thân
      const otherUsers = chat.users.filter(
        (user) => user._id !== loggedInUser._id
      );

      // Nếu nhóm có ít hơn hoặc bằng 4 thành viên, hiển thị tất cả avatar
      if (otherUsers.length <= 3) {
        return otherUsers.map((user) => (
          <Avatar.Root key={user._id}>
            <Avatar.Fallback name={user.fullName} />
            <Avatar.Image src={user.profilePic} />
          </Avatar.Root>
        ));
      }

      // Nếu nhóm có hơn 4 thành viên, hiển thị 3 avatar và số thành viên còn lại
      const displayedUsers = otherUsers.slice(0, 3); // Lấy 3 thành viên đầu tiên
      const remainingCount = otherUsers.length - 3;

      return (
        <>
          {displayedUsers.map((user) => (
            <Avatar.Root key={user._id}>
              <Avatar.Fallback name={user.fullName} />
              <Avatar.Image src={user.profilePic} />
            </Avatar.Root>
          ))}
          {remainingCount > 0 && (
            <Avatar.Root>
              <Avatar.Fallback>+{remainingCount}</Avatar.Fallback>
            </Avatar.Root>
          )}
        </>
      );
    }

    // Nếu là cuộc trò chuyện cá nhân, chỉ hiển thị avatar của người đó
    return (
      <Avatar.Root size={"xl"}>
        <Avatar.Fallback name={chat.users[0].fullName} />
        <Avatar.Image src={chat.users[0].profilePic} />
      </Avatar.Root>
    );
  };

  return (
    <AvatarGroup spacing={-1} size="xl" max={3}>
      {renderAvatars()}
    </AvatarGroup>
  );
};

export default ChatAvatars;
