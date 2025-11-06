import * as Avatar from "@radix-ui/react-avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center justify-center gap-x-12">
      <Avatar.Root className="bg-white h-6 w-6 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>NK</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-8 w-8 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>PS</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-10 w-10 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>RS</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-12 w-12 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>AP</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-16 w-16 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>VR</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}