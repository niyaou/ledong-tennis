package ledong.wxapp.service;

public interface IMatchService {

    /**
     * required a random match
     * 
     * @param user
     * @param courtGps
     * @return request id
     */
    public String requestMatching(String user, String courtGps);

}
