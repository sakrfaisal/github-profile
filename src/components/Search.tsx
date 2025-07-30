import { useState, useEffect } from "react";
import type { SearchResult } from "../types";

type SearchProps = {
  getUserData: (url: string, reposUrl: string) => void;
};

let debounceTimeout: number;

const Search = ({ getUserData }: SearchProps) => {
  const [searchBar, setSearchBar] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (searchBar.trim().length > 3) {
      fetchSearchResults(searchBar.trim());
    } else {
      setSearchResults([]);
    }
  }, [searchBar]);

  // Function to fetch search results with debounce
  function fetchSearchResults(query: string) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetch(`https://api.github.com/search/users?q=${query}&type=users&per_page=5`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.items);
        })
        .catch((error) => {
          console.error(error);
          setSearchResults([]);
          alert("Error fetching search results. Please try again later.");
        });
    }, 500);
  }

  // Handle search results click
  function handleResultClick(user: SearchResult) {
    getUserData(user.url, user.repos_url);
    setSearchBar("");
    setSearchResults([]);
  }

  return (
    <div className="container mx-auto px-6 w-full flex flex-col items-center h-40 sm:h-60">
      <div className="w-full sm:w-100 relative">
        <img
          src="Search.svg"
          alt="Search Icon"
          className="absolute left-2.5 top-1/2 -translate-y-1/2"
          width={24}
          height={24}
        />
        <input
          type="text"
          className="w-full h-full rounded-lg bg-quaternary px-6 py-3 pl-11 outline-none text-white text-sm"
          placeholder="Search for a user"
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
        />
      </div>
      <ul className="flex flex-col gap-2 w-full sm:w-100 mt-2 relative z-10">
        {searchResults.length > 0 &&
          searchResults.map((user, index) => (
            <li key={index}>
              <button
                className="flex items-center gap-4 w-full bg-tertiary rounded-lg p-2 hover:bg-tertiary/90 transition-colors duration-200 cursor-pointer"
                onClick={() => handleResultClick(user)}>
                <img
                  src={user.avatar_url}
                  alt={`${user.login} Avatar`}
                  className="w-10 h-10 rounded-md"
                />
                <div>
                  <h3>{user.login}</h3>
                </div>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Search;
