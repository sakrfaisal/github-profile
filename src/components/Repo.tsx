import type { RepoType } from "../types";

const Repo = ({ repo }: { repo: RepoType }) => {
  // hundle formatting of updated date
  // to show how many days ago the repo was updated
  function formatUpdatedAgo(dateString?: string): string {
    if (!dateString) return "";
    const updatedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - updatedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "updated today";
    if (diffDays === 1) return "updated 1 day ago";
    return `updated ${diffDays} days ago`;
  }

  return (
    <li>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="h-full flex flex-col gap-4 rounded-md bg-linear-card p-3 hover:scale-102 transition-transform duration-200">
        <h2>{repo.name}</h2>
        {repo.description && <p className="text-sm text-gray-300">{repo.description}</p>}
        <div className="flex items-center flex-gap gap-4 text-sm text-gray-300">
          {repo.license && (
            <span className="flex items-center gap-1">
              <img
                src="/Chield_alt.svg"
                alt={`${repo.license.spdx_id} License`}
                width={24}
                height={24}
              />
              {repo.license.spdx_id}
            </span>
          )}
          {repo.forks_count !== 0 && (
            <span className="flex items-center gap-1">
              <img src="/Nesting.svg" alt="Forks" width={24} height={24} />
              {repo.forks_count}
            </span>
          )}
          {repo.stargazers_count !== 0 && (
            <span className="flex items-center gap-1">
              <img src="/Star.svg" alt="Stars" width={24} height={24} />
              {repo.stargazers_count}
            </span>
          )}
          {repo.updated_at && <span>{formatUpdatedAgo(repo.updated_at)}</span>}
        </div>
      </a>
    </li>
  );
};

export default Repo;
