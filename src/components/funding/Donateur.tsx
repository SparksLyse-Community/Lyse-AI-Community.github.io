export default function Donateur({
  username,
  link,
}: {
  username: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-12 items-center border border-white/10 bg-white/3 px-5 m-2 mt-0 text-sm text-white/75 transition hover:border-white/25 hover:text-white"
    >
      {username}
    </a>
  );
}
