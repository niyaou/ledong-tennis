package ledong.wxapp.strategy.impl.slam;

import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Set;

import com.alibaba.fastjson.JSON;

import VO.MemberVo;
import VO.RankInfoVo;
import VO.SlamVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.strategy.SlamGenerator;

public class Base32Generator  extends SlamGenerator{



    @Override
    public String generate(String slamId) {
        return null;
    }


    public static LinkedList<MemberVo> createSeeds(Set<String> members){
        LinkedList<MemberVo> result = new  LinkedList<MemberVo>();
       Long s=System.currentTimeMillis();
        // LinkedList<MemberVo> temp = new LinkedList<MemberVo>();
        // members.forEach(m ->{
        //     HashMap<String,Object> currentRaw = SearchApi.searchById(DataSetConstant.USER_RANK_INFORMATION, m);
        //     MemberVo current = new MemberVo();
        //     current.setOpenId((String) currentRaw.get(RankInfoVo.OPENID));
        //     current.setScore((Integer) currentRaw.get(RankInfoVo.SLAMSCORE));
        //     MemberVo compare =null;
        //     try{
        //         compare= result.removeLast();
        //         if(current.getScore().intValue() <= compare.getScore().intValue()){
        //             result.addLast(compare);
        //             result.addLast(current);
        //             return;
        //         }else{
        //             temp.addFirst(compare);
        //         }
               
        //         while(current.getScore().intValue() > compare.getScore().intValue()){
        //             compare= result.removeLast();
        //             if(current.getScore().intValue() <= compare.getScore().intValue()){
        //                 result.addLast(compare);
        //                 result.addLast(current);
        //                 result.addAll(temp);
        //                 temp.clear();
        //                 return;
        //             }else{
        //                 temp.addFirst(compare);
        //             }
        //         }
              
        //         result.addLast(current);
        //     } catch (Exception e) {
        //       result.addLast(current);
        //     }
        //     result.addAll(temp);
        //     // System.out.println( m+"  --- 3    result size :"+JSON.toJSONString(result));
        //     temp.clear();
        // });
        // System.out.println( System.currentTimeMillis()-s);

        members.forEach(m ->{
            HashMap<String,Object> currentRaw = SearchApi.searchById(DataSetConstant.USER_RANK_INFORMATION, m);
            MemberVo current = new MemberVo();
            current.setOpenId((String) currentRaw.get(RankInfoVo.OPENID));
            current.setScore((Integer) currentRaw.get(RankInfoVo.SLAMSCORE));
          result.add(current);
        });

        result.sort(Comparator.comparingInt(MemberVo::getScore).reversed());
        System.out.println( System.currentTimeMillis()-s);
        return result;
    }
    
}