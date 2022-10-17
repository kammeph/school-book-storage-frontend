import { faKey, faPen, faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthApi from '../api/auth';
import { User } from '../api/users';
import UserEditDialog from './UserEditDialog';

const UserMenu: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { logout } = useAuthApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation(async () => await logout(), {
    onSuccess: data => {
      if (!data?.error) {
        queryClient.clear();
        navigate('/login');
      }
    }
  });

  return (
    <>
      {currentUser && (
        <UserEditDialog
          isOpen={editDialogOpen}
          initialUser={currentUser}
          currentUser={currentUser}
          onClose={() => setEditDialogOpen(false)}
        />
      )}
      <Menu as="div" className="relative inline-block text-left">
        <div className="">
          <Menu.Button className="inline-flex gap-1 items-center w-full justify-center rounded-md py-2 text-white focus:outline-none">
            <FontAwesomeIcon icon={faUser} />
            <b className="hidden lg:block">{currentUser?.username}</b>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mb-2 bottom-full w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none lg:bottom-auto lg:mb-0 lg:mt-2">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setEditDialogOpen(true)}
                    className={`${
                      active ? 'bg-indigo-100 text-indigo-800' : 'text-gray-900'
                    } flex gap-3 w-full items-center rounded-md px-2 py-2`}
                  >
                    <FontAwesomeIcon icon={faPen} className="text-indigo-600" />
                    Edit profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-indigo-100 text-indigo-800' : 'text-gray-900'
                    } flex gap-3 w-full items-center rounded-md px-2 py-2`}
                  >
                    <FontAwesomeIcon icon={faKey} className="text-indigo-600" />
                    Change password
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className={`${
                      active ? 'bg-indigo-100 text-indigo-800' : 'text-gray-900'
                    } flex gap-3 w-full items-center rounded-md px-2 py-2`}
                  >
                    <FontAwesomeIcon icon={faPowerOff} className="text-indigo-600" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default UserMenu;
