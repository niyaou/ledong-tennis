package ledong.wxapp.strategy.impl.filter;

import ledong.wxapp.strategy.MatchFilter;

public class LocationFilter extends MatchFilter {

    @Override
    public boolean filtering(Object holderLocate, Object challengerLocate) {
        double holderLng = Double.parseDouble(((String) holderLocate).split(",")[1]);
        double holderLat = Double.parseDouble(((String) holderLocate).split(",")[0]);
        double challengerLng = Double.parseDouble(((String) challengerLocate).split(",")[1]);
        double challengerLat = Double.parseDouble(((String) challengerLocate).split(",")[0]);

        return getDistance(holderLng, holderLat, challengerLng, challengerLat) < 20 * 1000;
    }

    public static double getDistance(double lng1, double lat1, double lng2, double lat2) {
        double radLat1 = Math.toRadians(lat1);
        double radLat2 = Math.toRadians(lat2);
        double a = radLat1 - radLat2;
        double b = Math.toRadians(lng1) - Math.toRadians(lng2);
        double s = 2 * Math.asin(Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378137.0;// 取WGS84标准参考椭球中的地球长半径(单位:m)
        s = Math.round(s * 10000) / 10000;
        return s;
    }
}
