package com.ledong.util;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import org.springframework.data.domain.Page;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class DefaultConverter {


//    public static <S, D> Page<D> convert(Page<S> page, Class<D> target) {
//        if (ObjectUtil.isNotNull(page)) {
//            Page<D> resultPage = new Page<>();
//            resultPage.setPageNo(page.getPageNo());
//            resultPage.setPageSize(page.getPageSize());
//            resultPage.setTotal(page.getTotal());
//            resultPage.setList(convert(page.getList(), target));
//            return resultPage;
//        }
//        return null;
//    }


    /***
     * List conversion via custom converter
     * @param sourceList
     * @param converter
     * @param <S>
     * @param <D>
     * @return
     */
    public static <S, D> List<D> convert(List<S> sourceList, Function<? super S, ? extends D> converter) {
        if (CollUtil.isNotEmpty(sourceList)) {
            return sourceList.stream().map(converter).collect(Collectors.toList());
        } else {
            return ObjectUtil.isNull(sourceList) ? null : new ArrayList<>();
        }
    }



    /**
     * By bean copy for converting list
     *
     * @param sourceList
     * @param target
     * @param <S>
     * @param <D>
     * @return
     */
    public static <S, D> List<D> convert(List<S> sourceList, Class<D> target) {
        try {
            if (CollUtil.isEmpty(sourceList)) {
                return ObjectUtil.isNull(sourceList) ? null : new ArrayList<>();
            } else {
                List<D> list = new ArrayList();
                Iterator iterator = sourceList.iterator();

                while (iterator.hasNext()) {
                    S source = (S) iterator.next();
                    D dest = target.getDeclaredConstructor().newInstance();
                    BeanUtil.copyProperties(source, dest);
                    list.add(dest);
                }

                return list;
            }
        } catch (InstantiationException e) {
            throw new RuntimeException("Cast " + sourceList.getClass() + " to " + target + " error.", e);
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Cast " + sourceList.getClass() + " to " + target + " error.", e);
        } catch (InvocationTargetException e) {
            throw new RuntimeException("Cast " + sourceList.getClass() + " to " + target + " error.", e);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException("Cast " + sourceList.getClass() + " to " + target + " error.", e);
        }
    }


    /**
     * Object conversion by bean copy
     *
     * @param source
     * @param target
     * @param <S>
     * @param <D>
     * @return
     */
    public static <S, D> D convert(S source, Class<D> target) {
        try {
            if (ObjectUtil.isEmpty(source)) {
                return null;
            }
            D dest = target.getDeclaredConstructor().newInstance();
            BeanUtil.copyProperties(source, dest);
            return dest;
        } catch (InstantiationException e) {
            throw new RuntimeException("Cast " + source.getClass() + " to " + target + " error.", e);
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Cast " + source.getClass() + " to " + target + " error.", e);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException("Cast " + source.getClass() + " to " + target + " error.", e);
        } catch (InvocationTargetException e) {
            throw new RuntimeException("Cast " + source.getClass() + " to " + target + " error.", e);
        }
    }
}
