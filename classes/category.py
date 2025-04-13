class Category:
    def __init__(self, categoryid, name, moderatorid):
        self._categoryid = categoryid
        self._name = name
        self._moderatorid = moderatorid

    def get_categoryid(self):
        return self._categoryid
    
    def get_name(self):
        return self._name
    def get_moderatorid(self):
        return self._moderatorid
    
    def set_categoryid(self, categoryid):
        self._categoryid = categoryid

    def set_name(self, name):
        self._name = name

    def set_moderatorid(self, moderatorid):
        self._moderatorid = moderatorid