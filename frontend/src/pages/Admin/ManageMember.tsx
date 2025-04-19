import React from 'react';

const ManageMember: React.FC = () => {
  return (
    <div className="p-6 w-full h-screen box-border">
      <div className="flex h-full border-2 rounded-2xl p-6 gap-6">
        <div className="flex-1 border-2 rounded-xl flex items-center justify-center text-gray-600">
          list of members
        </div>

        <div className="flex flex-col gap-6 justify-center">
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            blacklist members
          </button>
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            view member details
          </button>
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            view member analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMember;
