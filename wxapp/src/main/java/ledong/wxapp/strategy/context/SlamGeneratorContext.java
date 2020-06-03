package ledong.wxapp.strategy.context;

import ledong.wxapp.strategy.SlamGenerator;

public class SlamGeneratorContext {
    private SlamGenerator generator;

    public SlamGeneratorContext(SlamGenerator generator) {
        this.generator = generator;
    }

    public String generate(String slamId) {
        return generator.generate(slamId);
    }
}
