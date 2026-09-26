export default function Profil({ username, imageLink, link, role, text }: { username: string, imageLink: string, link: string, role: string, text: string }) {
  return (
    <article className="flex min-w-0 items-start gap-5 border border-white/10 bg-white/3 p-5 sm:p-6">
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        aria-label={`Profil GitHub de ${username}`}
        className="shrink-0"
      >
        <img
          src={imageLink}
          alt=""
          width="80"
          height="80"
          loading="lazy"
          className="size-20 rounded-full border border-white/15 object-cover"
        />
      </a>
      <div className="min-w-0">
        <h3 className="text-lg font-medium text-white">{username}</h3>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block break-all text-sm text-white/45 transition hover:text-white"
        >
          @{username}
        </a>
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#e8ff9c]">
          {role}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/60">
          {text}
        </p>
      </div>
    </article>
  );
}
