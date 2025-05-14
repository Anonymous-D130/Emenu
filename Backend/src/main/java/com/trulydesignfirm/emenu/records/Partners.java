package com.trulydesignfirm.emenu.records;

import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Restaurant;
import com.trulydesignfirm.emenu.model.Subscription;

public record Partners(LoginUser user, Restaurant restaurant, Subscription plan) {
}
