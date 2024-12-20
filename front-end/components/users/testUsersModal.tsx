import React from "react";

type Props={
    onClose: ()=>void;
}

const TestUsersModal = ({ onClose }: Props) => {
  const users = [
    {
      email: "admin@yadig.com",
      password: "verySecure",
      role: "admin",
    },
    {
      email: "adam@yadig.com",
      password: "adamDaMadMod",
      role: "moderator",
    },
    {
      email: "dezz@yadig.com",
      password: "dezzDaLameUser",
      role: "user",
    },
  ];

  const roleDescriptions = {
    User: "create and browse reviews and lists, edit/delete own reviews/lists, delete own comments, follow/unfollow users, like any reviews/lists, comment on any review, can be promoted to moderator by admin",
    Moderator: "user privileges + can delete any comments, can be demoted by admin",
    Admin:"moderator privileges + can Block users, view blocked users, promote/demote users/moderators, delete any review and list. IS PRE-CONFIGURED AND CANNOT BE PROMOTED/DEMOTED",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 opacity-100 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="bg-text1 rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex text-text2 justify-center items-center gap-2 mb-4">
          <h2 className="text-xl main-font">User Credentials</h2>
        </div>

        <div className="max-h-96 overflow-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead className="border-b text-bg2 main-font">
              <tr>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Password</th>
                <th className="px-4 py-2 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b text-text2 main-thin">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.password}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        user.role === "admin"
                          ? "bg-red-500 text-white"
                          : user.role === "moderator"
                          ? "bg-bg2 text-text2"
                          : "bg-text2 text-text1"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-lg main-font text-text2 mb-4">Role Descriptions</h3>
          <div className="space-y-4">
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <div
                key={role}
                className="p-4 bg-bg3 text-text2 rounded-lg shadow-sm"
              >
                <h4 className="main-font text-text1 mb-2">{role}</h4>
                <p className="text-sm main-thin text-text2">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestUsersModal;
