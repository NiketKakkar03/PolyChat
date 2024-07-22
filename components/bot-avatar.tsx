import { Avatar, AvatarImage } from "./ui/avatar";

const BotAvatar = () => {
  return (
    <Avatar className="h-16 w-16 ">
      <AvatarImage className="p-1" src="logo.png" style={{ transform: "translateX(-5px)" }}/>
    </Avatar>
  );
};

export default BotAvatar;
