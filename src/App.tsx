/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Search from "./components/Search";
import Repo from "./components/Repo";
import type { UserData, RepoType } from "./types";

const App = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<RepoType[]>([]);

  // Fetch initial user data
  useEffect(() => {
    fetch("https://api.github.com/users/sakrfaisal")
      .then((res) => res.json())
      .then((data: UserData) => {
        setUserData(data);
        return fetch(data.repos_url + "?per_page=4");
      })
      .then((res) => res.json())
      .then((data: RepoType[]) => {
        setRepos(data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle search input changes and fetch results

  // Function to get user data and repositories
  function getUserData(url: string, reposUrl: string) {
    fetch(url)
      .then((res) => res.json())
      .then((data: UserData) => {
        setUserData(data);
      });
    fetch(reposUrl + "?per_page=4")
      .then((res) => res.json())
      .then((data: RepoType[]) => {
        setRepos(data);
      })
      .catch((error) => {
        console.error(error);
        setRepos([]);
        alert("Error fetching user data. Please try again later.");
      });
  }

  // function to handle viewing al repos
  function handleViewAllRepos() {
    if (userData) {
      fetch(userData.repos_url)
        .then((res) => res.json())
        .then((data) => {
          setRepos(data);
        })
        .catch((error) => {
          console.error(error);
          setRepos([]);
          alert("Error fetching all repositories. Please try again later.");
        });
    }
  }

  return (
    <main className="min-h-screen">
      <div className="pt-6 bg-[url('/hero-bg-sm.webp')] sm:bg-[url('/hero-bg.webp')] bg-no-repeat bg-cover bg-center">
        <Search getUserData={getUserData} />
      </div>
      <div className="relative min-h-[calc(100vh-184px)] sm:min-h-[calc(100vh-264px)]">
        {!userData ? (
          <p
            id="loader"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 justify-center text-gray-200">
            <span></span>
            <span></span>
            <span></span>
          </p>
        ) : (
          <div className="container mx-auto px-6 flex flex-col gap-6 pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:gap-6">
              <img
                src={userData.avatar_url}
                alt="Github Icon"
                className="bg-black w-22 h-22 rounded-xl border-6 border-quaternary relative -top-8"
              />
              <div className="sm:py-2 flex flex-wrap gap-6 text-sm text-gray-200">
                <div className="bg-tertiary rounded-lg py-3 px-4 flex gap-2 justify-between">
                  <span>Followers</span>
                  <span className="h-full w-0.5 bg-quaternary"></span>
                  <span>{userData.followers}</span>
                </div>
                <div className="bg-tertiary rounded-lg py-3 px-4 flex gap-2 justify-between">
                  <span>Following</span>
                  <span className="h-full w-0.5 bg-quaternary"></span>

                  <span>{userData.following}</span>
                </div>
                <div className="bg-tertiary rounded-lg py-3 px-4 flex gap-2 justify-between">
                  <span>Location</span>
                  <span className="h-full w-0.5 bg-quaternary"></span>
                  <span>{userData.location || "undefined"}</span>
                </div>
              </div>
            </div>
            <div className="headings flex flex-col gap-3 mb-6">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-sm">{userData.bio}</p>
            </div>
            <ul className="repos grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.length > 0 && repos.map((repo, index) => <Repo key={index} repo={repo} />)}
            </ul>
            <div className="flex justify-center mt-6">
              {repos.length === userData.public_repos ? (
                ""
              ) : (
                <button
                  className="text-sm hover:text-gray-400 transition-colors duration-200 cursor-pointer"
                  onClick={handleViewAllRepos}>
                  View all repositories
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
