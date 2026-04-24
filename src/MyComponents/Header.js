import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import newlogo from "./../images/whitelogo.png";
import profilelogo from "./../images/profile.png";
import { useAuth } from "../context/AuthContext";
import { LogoutButton } from "../components/LogoutButton";

const navigation = [
  { name: "HOME", href: "/home", current: false },
  { name: "ABOUT US", href: "/aboutus", current: false },
  { name: "COURSES", href: "/coursecat", current: false },
];

function NavigationItem({ item }) {
  const { name, href, current } = item;
  return (
    <a
      href={href}
      className={`block rounded-md px-3 py-2 text-sm font-medium ${
        current
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {name}
    </a>
  );
}

export default function Navbar({ fixed }) {
  const { speak } = useSpeechSynthesis();
  const { isAuthenticated } = useAuth();
  const logo = "Shiksha logo.";
  const profile = "Profile.";

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                  <div className="flex items-center flex-shrink-0">
                    <img
                      className="block w-auto h-8 lg:hidden"
                      src={newlogo}
                      alt="logo"
                      onMouseOver={() => speak({ text: logo })}
                    />
                    <img
                      className="hidden w-auto h-8 lg:block"
                      src={newlogo}
                      alt="logo"
                      onMouseOver={() => speak({ text: logo })}
                    />
                  </div>
                  <div className="hidden sm:ml-10 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <NavigationItem key={item.name} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-2">
                  {/* Light/Dark theme toggle */}
                  {/* ... (your theme toggle code) ... */}

                  {isAuthenticated ? (
                    <>
                      {/* Profile link */}
                      <a href="/profile" className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Profile</span>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={profilelogo}
                          alt="Profile"
                          onMouseOver={() => speak({ text: profile })}
                        />
                      </a>
                      {/* Logout Button */}
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      {/* Login/Signup Links */}
                      <a 
                        href="/login" 
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                        onMouseOver={() => speak({ text: "Sign In" })}
                      >
                        Sign In
                      </a>
                      <a 
                        href="/signup" 
                        className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                        onMouseOver={() => speak({ text: "Create Account" })}
                      >
                        Sign Up
                      </a>

                      {/* Profile link */}
                      <a href="/profile" className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Profile</span>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={profilelogo}
                          alt="Profile"
                          onMouseOver={() => speak({ text: profile })}
                        />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <NavigationItem key={item.name} item={item} />
                ))}
                <div className="border-t border-gray-700 pt-2 mt-2 space-y-1">
                  {isAuthenticated ? (
                    <>
                      <a
                        href="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        onMouseOver={() => speak({ text: "Profile" })}
                      >
                        Profile
                      </a>
                      <div className="px-3 py-2">
                        <LogoutButton />
                      </div>
                    </>
                  ) : (
                    <>
                      <a
                        href="/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        onMouseOver={() => speak({ text: "Sign In" })}
                      >
                        Sign In
                      </a>
                      <a
                        href="/signup"
                        className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                        onMouseOver={() => speak({ text: "Create Account" })}
                      >
                        Sign Up
                      </a>
                    </>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
