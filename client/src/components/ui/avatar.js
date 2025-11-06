import * as Avatar from "@radix-ui/react-avatar";

export default function UserAvatar({ src, alt, fallback, size = "md" }) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  return (
    <Avatar.Root className={`bg-white ${sizeClasses[size]} overflow-hidden rounded-full border-2 border-blue-200`} style={{borderRadius: '50%'}}>
      <Avatar.Image
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <Avatar.Fallback 
        delayMs={600}
        className="bg-blue-100 text-blue-600 font-semibold flex items-center justify-center w-full h-full text-xs"
      >
        {fallback}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}