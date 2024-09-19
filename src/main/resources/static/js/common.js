//UserController REST
let url_ajaxCheckId = '/ajaxCheckId'; // post
let url_ajaxCheckNickname = '/ajaxCheckNickname'; //post
let url_join = '/join'; //post
let url_randomCategory = '/randomCategory'; //Get
let url_updateUpdate = '/updateUpdate'; //Put
let url_api_myPage_myLists = '/api/myPage/myLists'; //Post
let url_ajax_checkPwd = '/ajax/checkPwd'; //POST
let url_subscribe = '/subscribe/'; // Get {userId}

//RestaurantController REST
let url_api_all = '/api/all'; // get List<RestaurantDTO> restaurantAll(Model model)
let url_api_category = '/api/category'; //get responseBody Map<String, List<RestaurantDTO>>
let url_api_boardPage = '/api/boardPage'; //Get Param
let url_api_ajaxRestaurantMenu = '/api/ajaxRestaurantMenu'; // post
let url_api_ajaxRestaurantDetail = '/api/ajaxRestaurantDetail'; //POST
let url_api_ajax_CheckMyRestaurant = '/api/ajax/CheckMyRestaurant'; //POST
let url_api_ajax_DoMyRestaurant = '/api/ajax/DoMyRestaurant'; //post

//ReviewController REST
let url_reviews = '/reviews'; //post = <List<Review>>, put = <Void>
let url_api_r_reviews = '/api/r_reviews'; //get
let url_api_u_reviews = '/api/u_reviews'; //get
let url_reviews_reviewId = '/reviews/'; //DEl {reviewId}

//SubscriptionController REST
let url_subscriptions_search = '/subscriptions/search'; //Get
let url_subscriptions_subscriberList = '/subscriptions/subscriberList'; // @Get
let url_subscriptions_subscriber = '/subscriptions/subscribe/'; // GET,DEL {userId}
let url_subscriber = '/subscriptions/subscriber/'; // GET,DEL {subscriberId}

// common value for request
let any_k = (key) => key;
let any_v = (value) => value;
let any_idx = (idx) => idx;
//type

let content_type = "'application/x-www-form-urlencoded'"
let app_json = 'application/json';
let json = 'json';
// repository
let restaurant_repository = [];
let category_repository = [];
let user_repository = [];
