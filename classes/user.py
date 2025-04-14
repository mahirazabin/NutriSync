class User:
    def __init__(self, userid, name, email, phone_no, password, aid, user_flag):
        self._userid = userid
        self._name = name
        self._email = email
        self._phone_no = phone_no
        self._password = password
        self._aid = aid
        self._user_flag = user_flag

    def get_userid(self):
        return self._userid

    def get_name(self):
        return self._name

    def get_email(self):
        return self._email

    def get_phone_no(self):
        return self._phone_no

    def get_password(self):
        return self._password

    def get_aid(self):
        return self._aid

    def get_user_flag(self):
        return self._user_flag

    def set_userid(self, userid):
        self._userid = userid

    def set_name(self, name):
        self._name = name

    def set_email(self, email):
        self._email = email

    def set_phone_no(self, phone_no):
        self._phone_no = phone_no

    def set_password(self, password):
        self._password = password

    def set_aid(self, aid):
        self._aid = aid

    def set_user_flag(self, user_flag):
        self._user_flag = user_flag