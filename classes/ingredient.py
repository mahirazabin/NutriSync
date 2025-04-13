class Ingredient:
    def __init__(self, ingredientid, name, calories, unit, moderatorid):
        self._ingredientid = ingredientid
        self._name = name
        self._calories = calories
        self._unit = unit
        self._moderatorid = moderatorid

    def get_ingredientid(self):
        return self._ingredientid

    def get_name(self):
        return self._name

    def get_calories(self):
        return self._calories

    def get_unit(self):
        return self._unit

    def get_moderatorid(self):
        return self._moderatorid

    def set_ingredientid(self, ingredientid):
        self._ingredientid = ingredientid

    def set_name(self, name):
        self._name = name

    def set_calories(self, calories):
        self._calories = calories

    def set_unit(self, unit):
        self._unit = unit

    def set_moderatorid(self, moderatorid):
        self._moderatorid = moderatorid